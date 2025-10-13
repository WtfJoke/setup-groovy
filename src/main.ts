import { setFailed } from "@actions/core";
import { setupGroovy } from "./setup-groovy.js";

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
