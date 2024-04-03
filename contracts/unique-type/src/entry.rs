use crate::error::Error;
use ckb_std::{
    ckb_constants::Source,
    ckb_types::{bytes::Bytes, prelude::*, util::hash::Blake2bBuilder},
    high_level::{load_cell_type, load_input, load_script, QueryIter},
};
use core::result::Result;

const UNIQUE_ARGS_SIZE: usize = 20;

pub fn main() -> Result<(), Error> {
    check_type_id()?;
    check_inputs()?;
    Ok(())
}

fn check_type_id() -> Result<(), Error> {
    let unique_type = load_script()?;

    // Only one queue cell is allowed in the outputs
    if QueryIter::new(load_cell_type, Source::GroupOutput).count() > 1 {
        return Err(Error::OnlyOneUniqueOutputCellAllowed);
    }

    let first_output_index = QueryIter::new(load_cell_type, Source::Output)
        .position(|type_opt| {
            type_opt.map_or(false, |type_| type_.as_slice() == unique_type.as_slice())
        })
        .ok_or(Error::Encoding)?;

    let first_input = load_input(0, Source::Input)?;

    let mut blake2b = Blake2bBuilder::new(32)
        .personal(b"ckb-default-hash")
        .build();
    blake2b.update(first_input.as_slice());
    blake2b.update(&(first_output_index as u64).to_le_bytes());
    let mut ret = [0; 32];
    blake2b.finalize(&mut ret);

    let unique_args: Bytes = unique_type.args().unpack();
    if unique_args[..] != ret[0..UNIQUE_ARGS_SIZE] {
        return Err(Error::UniqueTypeIdInvalid);
    }
    Ok(())
}

// Ensure that unique cells cannot appear in transaction inputs, that is, unique cells cannot be
// updated and destroyed
fn check_inputs() -> Result<(), Error> {
    let unique_type = load_script()?;
    let is_unique_input_exist = QueryIter::new(load_cell_type, Source::Input)
        .any(|type_opt| type_opt.map_or(false, |type_| type_.as_slice() == unique_type.as_slice()));
    if is_unique_input_exist {
        return Err(Error::InputUniqueCellForbidden);
    }
    Ok(())
}
