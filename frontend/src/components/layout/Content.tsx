import { AddComponent } from './AddComponent';
import { Satisfication } from './Satisfaction';
import { Segmentation } from './Segmentation';
import { Graph } from './Graph';
import { NameCard } from './NameCard';
import { TopCountries } from './TopCountries';
import './Content.css';

export const Content = ({ }) => {
    const employeeData = [
        {
            id: 1,
            name: 'Esther Howard',
            position: "Sale's manager USA",
            transactions: 3490,
            rise: true,
            tasksCompleted: 3,
            imgId: 0,
        },
        {
            id: 2,
            name: 'Eleanor Pena',
            position: "Sale's manager Europe",
            transactions: 590,
            rise: false,
            tasksCompleted: 5,
            imgId: 2,
        },
        {
            id: 3,
            name: 'Robert Fox',
            position: "Sale's manager Asia",
            transactions: 2600,
            rise: true,
            tasksCompleted: 1,
            imgId: 3,
        },
    ];

    return (
        <div className="flex w-full">
            <div className="h-screen flex-grow-overflow-auto flex flex-wrap-content-start p-2">
                <div className="flex">
                    {employeeData.map(
                        ({
                            id,
                            name,
                            position,
                            transactions,
                            rise,
                            tasksCompleted,
                            imgId,
                        }) => (
                            <NameCard
                                key={id}
                                id={id}
                                name={name}
                                position={position}
                                transactionAmount={transactions}
                                rise={rise}
                                tasksCompleted={tasksCompleted}
                                imgId={imgId}
                            />
                        ),
                    )}
                </div>
                <div className="w-full p-2 lg:w-2/3">
                    <div className="rounded-lg bg-card sm:h-80 h-60">
                        <Graph />
                    </div>
                </div>
                <div className="w-full p-2 lg:w-1/3">
                    <div className="rounded-lg bg-card overflow-hidden h-80">
                        <AddComponent />
                    </div>
                </div>
                <div className="w-full p-2 lg:w-1/3">
                    <div className="rounded-lg bg-card h-80">
                        <TopCountries />
                    </div>
                </div>

                <div className="w-full p-2 lg:w-1/3">
                    <div className="rounded-lg bg-card h-80">
                        <Segmentation />
                    </div>
                </div>
                <div className="w-full p-2 lg:w-1/3">
                    <div className="rounded-lg bg-card h-80">
                        <Satisfication />
                    </div>
                </div>
            </div>
        </div>
    );
}
