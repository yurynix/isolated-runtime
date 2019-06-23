const { IsolatedRuntime } = require("../");
const { RuntimeTimeoutError } = require("../lib/errors");

describe("isolated-runtime code as string", () => {
  it("should run a dummy function", async () => {
    const runtime = new IsolatedRuntime({
      poolOptions: {
        min: 2,
        max: 2
      },
      timeout: 1500
    });

    const result = await runtime.run({
      code: (() => {
        return "hello world";
      }).toString(),
      args: ["hello"]
    });

    expect(result).toEqual("hello world");
  });

  it("should timeout a while true", async () => {
    const runtime = new IsolatedRuntime({
      poolOptions: {
        min: 2,
        max: 2
      },
      timeout: 1500
    });

    try {
      await runtime.run({
        code: (() => {
          while (true) {} // eslint-disable-line no-empty, no-constant-condition
        }).toString(),
        args: ["hello"]
      });
    } catch (error) {
      expect(error).toBeInstanceOf(RuntimeTimeoutError);
    }
  });

  it("should return async value", async () => {
    const runtime = new IsolatedRuntime({
      poolOptions: {
        min: 2,
        max: 2
      },
      timeout: 1500
    });

    const result = await runtime.run({
      code: (() => new Promise(resolve => resolve("hello"))).toString(),
      args: ["hello"]
    });

    expect(result).toEqual("hello");
  });
});
