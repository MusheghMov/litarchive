import { ReactRenderer } from "@tiptap/react";
import PopoverWrapper from "./PopoverWrapper";
import honoClient from "@/app/honoRPCClient";

export default {
  char: "@",
  items: async ({ editor, query }: { editor: any; query: any }) => {
    const res = await honoClient.authors.$get({
      query: {
        search: "",
      },
    });

    if (!res.ok) {
      console.error("error: ", res);
      return null;
    }

    const authors = await res.json();
    const authorsNames = authors.map((author) => author.name!);
    return authorsNames;
  },
  render: () => {
    let component: any;
    let anchorEl: HTMLElement | null = null;
    let isOpen = false;

    // Function to create and append anchor element
    const createAnchorElement = (rect: DOMRect) => {
      if (anchorEl) {
        document.body.removeChild(anchorEl);
      }

      anchorEl = document.createElement("div");
      anchorEl.style.position = "absolute";
      anchorEl.style.left = `${rect.left}px`;
      anchorEl.style.top = `${rect.top}px`;
      anchorEl.style.width = "0";
      anchorEl.style.height = "0";
      anchorEl.id = "mention-anchor";
      document.body.appendChild(anchorEl);

      return anchorEl;
    };

    return {
      onStart: (props: any) => {
        if (!props.clientRect) {
          return;
        }

        // Create anchor at the cursor position
        createAnchorElement(props.clientRect());

        // Create the React component
        component = new ReactRenderer(PopoverWrapper, {
          props: {
            props,
            open: true,
          },
          editor: props.editor,
        });

        // Mount component to the anchor
        const anchorWrapper = document.getElementById("mention-anchor");
        if (anchorWrapper && component.element) {
          anchorWrapper.appendChild(component.element);
        }

        isOpen = true;
      },

      onUpdate(props: any) {
        if (!props.clientRect) {
          return;
        }

        // Update anchor position
        if (anchorEl) {
          const rect = props.clientRect();
          anchorEl.style.left = `${rect.left}px`;
          anchorEl.style.top = `${rect.top}px`;
        }

        // Update component props
        component.updateProps({
          props,
          open: isOpen,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          isOpen = false;
          component.updateProps({
            props,
            open: false,
          });
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        isOpen = false;

        // Clean up anchor element
        if (anchorEl) {
          document.body.removeChild(anchorEl);
          anchorEl = null;
        }

        // Destroy React component
        component.destroy();
      },
    };
  },
};
