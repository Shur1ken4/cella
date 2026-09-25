//! Biotech Asset Passport: passport accounts, document hashes and lifecycle stage. Implemented in Phase 5.
use anchor_lang::prelude::*;

declare_id!("9JTETAXHHUsDQyNKXYjBqKmeEZ6n1VSRH9nRCpf2x9JW");

#[program]
pub mod passport {
    use super::*;

    /// Phase 0 placeholder so the workspace builds. Replaced in a later phase.
    pub fn ping(_ctx: Context<Ping>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Ping {}
