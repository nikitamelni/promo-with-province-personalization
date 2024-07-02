// ProvinceSelector.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ProvinceSelector: React.FC = () => {
  const router = useRouter();
  const [selected_province, setSelectedProvince] = useState<string>("");

  useEffect(() => {
    // Get the initial value from the query string if it exists
    const initialProvince = router.query.selected_province as string;
    if (initialProvince) {
      setSelectedProvince(initialProvince);
    }
  }, [router.query.selected_province]);

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const province = event.target.value;
    setSelectedProvince(province);
    // Update the query string parameter and force request to the server
    router.push({
      pathname: router.pathname,
      query: { ...router.query, selected_province: province },
    });
  };

  return (
    <div>
      <label htmlFor="province-selector">Select your province: </label>
      <select
        id="province-selector"
        value={selected_province}
        onChange={handleProvinceChange}
      >
        <option value="">--Select Province--</option>
        <option value="ON">ON</option>
        <option value="QC">QC</option>
        <option value="BC">BC</option>
      </select>
    </div>
  );
};

export default ProvinceSelector;
