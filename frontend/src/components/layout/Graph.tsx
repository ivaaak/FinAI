import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Icon } from "./Icon";
import TradingViewDiagram from "../tradingView/TradingViewDiagram";
import { ChatWindow } from "../ChatWindow";

export const Graph = () => {
    const graphData = [
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
    ].map((i) => {
        const revenue = 500 + Math.random() * 2000;
        const expectedRevenue = Math.max(revenue + (Math.random() - 0.5) * 2000, 0);
        return {
            name: i,
            revenue,
            expectedRevenue,
            sales: Math.floor(Math.random() * 500),
        };
    });

    const CustomTooltip = () => (
        <div className="rounded-xl overflow-hidden tooltip-head">
            <div className="flex items-center justify-between p-2">
                <div className="">Revenue</div>
                <Icon path="res-react-dash-options" className="w-2 h-2" />
            </div>
            <div className="tooltip-body text-center p-3">
                <div className="text-white font-bold">$1300.50</div>
                <div className="">Revenue from 230 sales</div>
            </div>
        </div>
    );
    return (
        <>
            <TradingViewDiagram></TradingViewDiagram>
            {/* Prediction + Chat */}
            <div>
                Price Prediction Based on Model:
                <LineChart width={500} height={300} data={graphData}>
                    <defs>
                        <linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0">
                            <stop stopColor="#6B8DE3" />
                            <stop offset="1" stopColor="#7D1C8D" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        horizontal={false}
                        strokeWidth="6"
                        stroke="#252525"
                    />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Line
                        activeDot={false}
                        type="monotone"
                        dataKey="expectedRevenue"
                        stroke="#242424"
                        strokeWidth="3"
                        dot={false}
                        strokeDasharray="8 8"
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="url(#paint0_linear)"
                        strokeWidth="4"
                        dot={false}
                    />
                </LineChart>
                <div className="chatWindow">
                    <ChatWindow messages={[]}></ChatWindow>
                </div>
            </div>
        </>
    );
}
