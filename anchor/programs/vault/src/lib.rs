//! Biotech Asset Passport: USDC vault, milestone tranches and pro-rata payouts. Implemented in Phase 7.
use anchor_lang::prelude::*;

declare_id!("F68Q3DdSzz1m4Gq2QSBiwoKSsVyHfaDbUrUputmbW3jS");

#[program]
pub mod vault {
    use super::*;

    /// Phase 0 placeholder so the workspace builds. Replaced in a later phase.
    pub fn ping(_ctx: Context<Ping>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Ping {}
