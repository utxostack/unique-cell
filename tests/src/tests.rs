use crate::{assert_script_error, Loader};
use blake2b_rs::Blake2bBuilder;
use ckb_testtool::ckb_types::{
    bytes::Bytes,
    core::{TransactionBuilder, TransactionView},
    packed::*,
    prelude::*,
};
use ckb_testtool::{builtin::ALWAYS_SUCCESS, context::Context};

const MAX_CYCLES: u64 = 10_000_000;

// error numbers
const UNIQUE_TYPE_ID_INVALID: i8 = 6;
const INPUT_UNIQUE_CELL_FORBIDDEN: i8 = 7;
const ONLY_ONE_UNIQUE_OUTPUT_CELL_ALLOWED: i8 = 8;

#[derive(PartialEq)]
enum UniqueError {
    NoError,
    UniqueTypeIdInvalid,
    InputUniqueCellForbidden,
    OnlyOneUniqueOutputCellAllowed,
}

fn create_test_context(unique_error: UniqueError) -> (Context, TransactionView) {
    // deploy contract
    let mut context = Context::default();
    let unique_bin: Bytes = Loader::default().load_binary("unique-type");
    let unique_out_point = context.deploy_cell(unique_bin);

    // deploy always_success script
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());

    // prepare scripts
    let lock_script = context
        .build_script(&always_success_out_point, Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    // prepare cells
    let empty_input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let empty_input = CellInput::new_builder()
        .previous_output(empty_input_out_point)
        .build();

    let mut blake2b = Blake2bBuilder::new(32)
        .personal(b"ckb-default-hash")
        .build();
    blake2b.update(empty_input.as_slice());
    blake2b.update(&(0u64).to_le_bytes());
    let mut ret = [0; 32];
    blake2b.finalize(&mut ret);
    let unique_type_args = match unique_error {
        UniqueError::UniqueTypeIdInvalid => Bytes::copy_from_slice(&[0xFF; 20]),
        _ => Bytes::copy_from_slice(&ret[0..20]),
    };

    let unique_type_script = context
        .build_script(&unique_out_point, unique_type_args)
        .expect("script");
    let unique_type_script_dep = CellDep::new_builder()
        .out_point(unique_out_point.clone())
        .build();

    let unique_input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .type_(Some(unique_type_script.clone()).pack())
            .build(),
        Bytes::new(),
    );

    let mut inputs = vec![empty_input.clone()];
    if unique_error == UniqueError::InputUniqueCellForbidden {
        inputs.push(
            CellInput::new_builder()
                .previous_output(unique_input_out_point)
                .build(),
        );
    }

    let mut outputs = vec![CellOutput::new_builder()
        .capacity(500u64.pack())
        .lock(lock_script.clone())
        .type_(Some(unique_type_script.clone()).pack())
        .build()];
    let mut outputs_data = vec![Bytes::default()];
    if unique_error == UniqueError::OnlyOneUniqueOutputCellAllowed {
        outputs.push(
            CellOutput::new_builder()
                .capacity(500u64.pack())
                .lock(lock_script)
                .type_(Some(unique_type_script).pack())
                .build(),
        );
        outputs_data.push(Bytes::default());
    }

    let mut witnesses = vec![];
    for _ in 0..inputs.len() {
        witnesses.push(Bytes::from("0x"))
    }

    // build transaction
    let tx = TransactionBuilder::default()
        .inputs(inputs)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .cell_dep(lock_script_dep)
        .cell_dep(unique_type_script_dep)
        .witnesses(witnesses.pack())
        .build();
    (context, tx)
}

#[test]
fn test_create_unique_cell_success() {
    let (mut context, tx) = create_test_context(UniqueError::NoError);
    let tx = context.complete_tx(tx);
    let cycles = context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

#[test]
fn test_unique_type_id_error() {
    let (mut context, tx) = create_test_context(UniqueError::UniqueTypeIdInvalid);
    let tx = context.complete_tx(tx);
    let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
    assert_script_error(err, UNIQUE_TYPE_ID_INVALID);
}

#[test]
fn test_input_unique_cell_forbidden_error() {
    let (mut context, tx) = create_test_context(UniqueError::InputUniqueCellForbidden);
    let tx = context.complete_tx(tx);
    let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
    assert_script_error(err, INPUT_UNIQUE_CELL_FORBIDDEN);
}

#[test]
fn test_output_unique_cell_count_error() {
    let (mut context, tx) = create_test_context(UniqueError::OnlyOneUniqueOutputCellAllowed);
    let tx = context.complete_tx(tx);
    let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
    assert_script_error(err, ONLY_ONE_UNIQUE_OUTPUT_CELL_ALLOWED);
}
