export const UserRole = {
  MERCHANT: "MERCHANT",
  INVESTOR: "INVESTOR",
};

export const ROLE_META = {
  [UserRole.MERCHANT]: {
    label: "Merchant",
    description:
        "Upload your invoices, get a risk score in under a minute, and turn them into cash today through factoring.",
  },
  [UserRole.INVESTOR]: {
    label: "Investor",
    description:
        "Invest in verified invoice deals and earn 12–18% annual returns.",
  },
};
