import { render } from "@testing-library/react-native";
import { I18nextProvider } from "react-i18next";

import { StatusBadge } from "@/components/ui/StatusBadge";
import i18n from "@/i18n";

describe("StatusBadge", () => {
  it("renders a translated status label", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <StatusBadge status="in_progress" />
      </I18nextProvider>
    );

    expect(getByText("In progress")).toBeTruthy();
  });
});

