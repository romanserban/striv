import { fireEvent, render, screen } from "@testing-library/react-native";

import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders the label and handles press events", () => {
    const onPress = jest.fn();

    render(<Button label="Submit" onPress={onPress} />);

    fireEvent.press(screen.getByRole("button"));

    expect(screen.getByText("Submit")).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
