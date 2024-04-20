// global.d.ts or another appropriate file in your project
declare global {
    interface Window {
        TradingView: any; // You can replace 'any' with a more specific type if you have one
    }
}
