export type IcgPrincipleId =
  | "evidence"
  | "adoption"
  | "ambiguity"
  | "execution"
  | "accountable"
  | "practice";

export type HomepagePrincipleId = Exclude<IcgPrincipleId, "execution">;

export type IcgPrinciple = {
  id: IcgPrincipleId;
  number: string;
  title: string;
  short: string;
  full: string;
  homepage: boolean;
};

export type HomepagePrinciple = IcgPrinciple & {
  id: HomepagePrincipleId;
  homepage: true;
};

export const icgPrinciples: readonly IcgPrinciple[] = [
  {
    id: "evidence",
    number: "01",
    title: "Evidence Before Opinion",
    short:
      "We distinguish confirmed fact from working assumption in every document we produce.",
    full: "We distinguish confirmed fact from working assumption in every document we produce. Clients can identify, at all times, which figures are audited and which are our own modelling.",
    homepage: true,
  },
  {
    id: "adoption",
    number: "02",
    title: "Designed for Adoption",
    short:
      "We design proposals around the mandate and budget a client already holds, so they can actually be adopted.",
    full: "A recommendation that cannot be funded, staffed, or approved under existing authority is not a viable recommendation. We design our proposals around the mandate and budget a client already holds.",
    homepage: true,
  },
  {
    id: "ambiguity",
    number: "03",
    title: "Discipline Under Ambiguity",
    short:
      "We state our assumptions explicitly and quantify how conclusions shift if those assumptions prove wrong.",
    full: "Public-sector problems rarely present complete data. We do not delay recommendations pending perfect information; we state assumptions explicitly and quantify how conclusions shift if those assumptions prove wrong.",
    homepage: true,
  },
  {
    id: "execution",
    number: "04",
    title: "Execution, Not Only Advice",
    short:
      "Our recommendations are grounded in what our own teams can deliver, not only in what we advise.",
    full: "Across our domains, we carry out the work itself: site investigation, assessment, design, system planning and implementation. Our recommendations are grounded in what our own teams can deliver, not only in what we advise.",
    homepage: false,
  },
  {
    id: "accountable",
    number: "05",
    title: "Accountable to the Evidence",
    short:
      "Every recommendation we publish is one we are prepared to defend under direct examination.",
    full: "We do not adjust conclusions to suit client preference. Every recommendation we publish is one we are prepared to defend under direct examination.",
    homepage: true,
  },
  {
    id: "practice",
    number: "06",
    title: "A Practice Built on Doing",
    short:
      "Our team, including our interns, develops judgement through real analysis that clients act upon, not simulated exercises.",
    full: "Our team, including our interns, engages with live client problems from the outset. We hold that sound judgment develops through accountability for real analysis that clients act upon, not through simulated exercises.",
    homepage: true,
  },
];

export const homepagePrinciples = icgPrinciples.filter(
  (principle): principle is HomepagePrinciple => principle.homepage,
);
