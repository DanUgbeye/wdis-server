import { DisposalStats } from "../disposal/disposal.types";

export type AppStats = {
  numBins: number;
  disposal: DisposalStats;
};
