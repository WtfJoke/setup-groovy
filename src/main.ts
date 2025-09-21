import { setFailed } from "@actions/core";
import { setupGroovy } from "./setup-groovy";

const run = async () => {
  try {
    await setupGroovy();
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
};

void run();
