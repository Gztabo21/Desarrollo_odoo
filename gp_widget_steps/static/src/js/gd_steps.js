/** @odoo-module */
import { Component, useState ,useRef,useEffect,onWillRender} from "@odoo/owl";
import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { _t } from "@web/core/l10n/translation";
import { useCommand } from "@web/core/commands/command_hook";
import { groupBy } from "@web/core/utils/arrays";
import { escape } from "@web/core/utils/strings";
import {StatusBarField} from  "@web/views/fields/statusbar/statusbar_field";

/**
 * @param {...HTMLElement} els
 */
const hide = (...els) => els.forEach((el) => el.classList.add("d-none"));

/**
 * @param {...HTMLElement} els
 */
const show = (...els) => els.forEach((el) => el.classList.remove("d-none"));

export class StatusSteps extends StatusBarField {
    static template = "gp_widget_steps.StatusSteps";
    static props = {
            ...standardFieldProps,
            domain: { type: [Array, Function], optional: true },
            foldField: { type: String, optional: true },
            isDisabled: { type: Boolean, optional: true },
            visibleSelection: { type: Array, element: String, optional: true },
            withCommand: { type: Boolean, optional: true },
            sortedFieldItems: { type: String, optional: true },
        };

    setup() {
        debugger;
        let status = "idle";
        const adjust = () => {
            status = "adjusting";
            this.adjustVisibleItems();
            this.render();
            browser.requestAnimationFrame(() => (status = "idle"));
        };
      super.setup();
      console.log("Setup Steps Widget");
    }
      adjustVisibleItems() {
        // Get all visible buttons
        // debugger;
        const itemEls = [
            ...this.rootRef.el.querySelectorAll(".ike-progress-step"),
        ];
        const selectedIndex = itemEls.findIndex((el) =>
            el.classList.contains("active")
    );
    const itemsBefore = itemEls.slice(selectedIndex + 2).reverse();
    const itemsAfter = itemEls.slice(0, Math.max(selectedIndex - 1, 0)).reverse();
    debugger;
    // // Reset hidden elements
    show(...itemEls);
    if (this.dropdownRef.el && this.beforeRef.el){

        hide(this.dropdownRef.el, this.beforeRef.el);
    }

        if (this.items.folded.length) {
            show(this.afterRef.el);
            itemEls.forEach((el) => el.classList.remove("o_first"));
        } else {
            if (this.afterRef.el) {
                hide(this.afterRef.el);
            }
            itemEls[0]?.classList.add("o_first");
        }

        // Reset items variables
        this.items.before = [];
        this.items.after = [...this.items.folded];
        const itemsToAssign = this.getAllItems().filter((item) => !item.isFolded);

        while (this.areItemsWrapping()) {
            if (itemsBefore.length) {
                // Case 1: elements before can be hidden
                show(this.beforeRef.el);
                hide(itemsBefore.shift());
                this.items.before.push(itemsToAssign.shift());
            } else if (itemsAfter.length) {
                // Case 2: elements before are hidden, elements after can be hidden
                show(this.afterRef.el);
                hide(itemsAfter.pop());
                this.items.after.unshift(itemsToAssign.pop());
            } else {
                // Last resort: no elements can be hidden => fallback to single dropdown
                show(this.dropdownRef.el);
                hide(this.beforeRef.el, this.afterRef.el, ...itemEls);
                break;
            }
        }
    }
    async updateStepItemClick(item) {
       const {name,record} = this.props;
       const value = this.field.type === "many2one" ? [item.value, item.label] : item.value;
       await record.update({ [name]: value });
       await record.save();
    }
}

export const statusSteps = {
    component: StatusSteps,
    supportedOptions: [
        {
            label: _t("Clickable"),
            name: "clickable",
            type: "boolean",
            default: true,
        },
        {
            label: _t("sorted Field Items"),
            name: "sorteditems",
            type: "string",
            default: "",
        }
    ],
    supportedTypes: ["many2one", "selection"],
    extractProps: ({ attrs, options, viewType }, dynamicInfo) => ({
        isDisabled: !options.clickable || dynamicInfo.readonly,
        visibleSelection: attrs.statusbar_visible?.trim().split(/\s*,\s*/g),
        withCommand: viewType === "form",
        foldField: options.fold_field,
        domain: dynamicInfo.domain,
        sortedFieldItems: options.sorteditems ,
    }),
}

registry.category("fields").add("gp_widget_steps", statusSteps);