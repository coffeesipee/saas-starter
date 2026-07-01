import * as React from "react";
import { Menu } from "@base-ui/react/menu";

export function Test() {
  return (
    <Menu.Root>
      <Menu.Trigger render={<button />}>Trigger</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item render={<a href="#" />}>Item</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
