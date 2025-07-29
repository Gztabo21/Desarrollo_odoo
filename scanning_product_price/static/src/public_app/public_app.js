import { App, whenReady, Component, useState, onWillStart } from "@odoo/owl";
import { CardLayout } from "@scanning_product_price/components/card_layout/card_layout";
import { makeEnv, startServices } from "@web/env";
import { getTemplate } from "@web/core/templates";
import { _t } from "@web/core/l10n/translation";
import { MainComponentsContainer } from "@web/core/main_components_container";
import { rpc } from "@web/core/network/rpc";
import { useService, useBus } from "@web/core/utils/hooks";
import { url } from "@web/core/utils/urls";
import { SppProductDetail } from "@scanning_product_price/components/product_detail/public_product_detail";
import { SppBarcodeScanner } from "@scanning_product_price/components/spp_barcode/spp_barcode";
import { browser } from "@web/core/browser/browser";
import { isIosApp } from "@web/core/browser/feature_detection";
import { session } from "@web/session";

class SppApp extends Component{
    static template = "scanning_product_price.public_kiosk_app";
    static props = {
        token: { type: String },
        companyId: { type: Number },
        companyName: { type: String },
        companyCurrency:{type:Number, optional: true},
        kioskMode: { type: String },
        barcodeSource: { type: String },
        fromTrialMode: { type: Boolean },
    };
    static components = {
        SppBarcodeScanner,
        CardLayout,
        SppProductDetail,
        MainComponentsContainer,
    };

    setup() {
        this.barcode = useService("barcode");
        this.notification = useService("notification");
        this.companyImageUrl = url("/web/binary/company_logo", {
            company: this.props.companyId,
        });
        this.state = useState({
            barcode: false,
            barcodeIsSet: false,
            active_display: "settings",
            displayDemoMessage: browser.localStorage.getItem("scanning_product_price.ShowDemoMessage") !== "false",
        });
        this.lockScanner = false;
        if (this.props.kioskMode === 'settings' || this.props.fromTrialMode){
            this.manualKioskMode = false;
            useBus(this.barcode.bus, "barcode_scanned", (ev) => this.onBarcodeScanned(ev.detail.barcode));
        }
        else if (this.props.kioskMode !== 'manual') {
            useBus(this.barcode.bus, "barcode_scanned", (ev) => this.onBarcodeScanned(ev.detail.barcode));
            this.state.active_display = "main";
            this.manualKioskMode = false;
        } else {
            this.manualKioskMode = true;
            this.state.active_display = "manual";
        }

    }


    switchDisplay(screen) {
        const displays = ["main", "scanned", "manual", "pin", "settings"];
        if (displays.includes(screen)) {
            this.state.active_display = screen;
        } else {
            this.state.active_display = "main";
        }
    }



    kioskReturn() {
        if (this.state.active_display === "settings"){
            history.back();
        } else if (
            (["manual", "barcode"].includes(this.props.kioskMode) ||
                (this.props.kioskMode === "barcode_manual" &&
                    this.state.active_display === "main")) &&
            this.props.fromTrialMode
        ) {
            this.switchDisplay("settings");
        } else if (this.props.kioskMode === 'manual') {
            this.switchDisplay("manual");
        } else {
            this.switchDisplay("main");
        }
    }

    displayNotification(text){
        this.notification.add(text, { type: "danger" });
    }

    async makeRpcWithGeolocation(route, params) {
        if (!isIosApp()) { // iOS app lacks permissions to call `getCurrentPosition`
            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    async ({ coords: { latitude, longitude } }) => {
                        const result = await rpc(route, {
                            ...params,
                            latitude,
                            longitude,
                        });
                        resolve(result);
                    },
                    async (err) => {
                        const result = await rpc(route, {
                            ...params
                        });
                        resolve(result);
                    },
                    { enableHighAccuracy: true }
                );
            });
        }
        else {
            return rpc(route, {...params})
        }
    }


    async onBarcodeScanned(barcode){
        if (this.lockScanner || this.state.active_display !== 'main') {
            return;
        }
        this.lockScanner = true;
        const result = await rpc('/scanning_product_price/product_barcode_scanned',
            {
                'barcode': barcode,
                'token': this.props.token
            })

        if (result && result.product_name) {
            this.productData = result
            this.switchDisplay('scanned')
        }else{
            this.displayNotification(_t("Producto no encontrado '%(barcode)s.'", { barcode }))
        }
        this.lockScanner = false
    }


}

export async function createPublicKioskSpp(document, kiosk_backend_info) {
    await whenReady();
    const env = makeEnv();
    await startServices(env);
    session.server_version_info = kiosk_backend_info.server_version_info;
    const app = new App(SppApp, {
        getTemplate,
        env: env,
        props:
            {
                token : kiosk_backend_info.token,
                companyId: kiosk_backend_info.company_id,
                companyName: kiosk_backend_info.company_name,
                companyCurrency: kiosk_backend_info.company_currency,
                kioskMode: kiosk_backend_info.kiosk_mode,
                barcodeSource: kiosk_backend_info.barcode_source,
                fromTrialMode: kiosk_backend_info.from_trial_mode,
            },
        dev: env.debug,
        translateFn: _t,
        translatableAttributes: ["data-tooltip"],
    });
    return app.mount(document.body);
}
export default { SppApp, createPublicKioskSpp };
