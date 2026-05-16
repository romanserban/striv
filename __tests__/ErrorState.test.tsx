import { fireEvent, render } from "@testing-library/react-native";

import { ErrorState } from "@/components/ui/ErrorState";

describe("ErrorState", () => {
  it("renders title and message", () => {
    const { getByText } = render(<ErrorState title="Load failed" message="Try again later." />);

    expect(getByText("Load failed")).toBeTruthy();
    expect(getByText("Try again later.")).toBeTruthy();
  });

  it("calls retry action when provided", () => {
    const onRetry = jest.fn();
    const { getByRole } = render(
      <ErrorState title="Load failed" message="Try again later." retryLabel="Retry" onRetry={onRetry} />
    );

    fireEvent.press(getByRole("button"));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

