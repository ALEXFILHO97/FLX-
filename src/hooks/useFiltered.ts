type StatusEnum =
  | "WAITING_APPROVAL"
  | "WAITING_PROVIDER"
  | "QUOTE_ACCEPTED"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED";

import { useState } from "react";

export function useFiltered() {
  const [selectedEnums, setSelectedEnums] = useState<StatusEnum[]>([]);

  const toggleEnum = (value: StatusEnum) => {
    setSelectedEnums((selectedEnums) =>
      selectedEnums.includes(value)
        ? selectedEnums.filter((enumValue) => enumValue !== value)
        : [...selectedEnums, value]
    );
  };

  return {
    selectedEnums,
    toggleEnum,
  };
}
