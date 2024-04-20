import { Header } from './components/layout/Header';
import { Graph } from './components/layout/Graph';
import { NameCard } from './components/layout/NameCard';
import { Satisfication } from './components/layout/Satisfaction';
import { Segmentation } from './components/layout/Segmentation';
import { TopCountries } from './components/layout/TopCountries';
import './App.css';

function App() {
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
      <div className="h-screen p-2">
      <div className="w-full p-2 lg:w-1/3">
          <div className="rounded-lg bg-card overflow-hidden h-80">
              <Header />
          </div>
      </div>
      <div className="w-full p-2 lg:w-2/3">
          <div className="flex rounded-lg bg-card sm:h-80 h-60">
              <Graph />
          </div>
      </div>

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
      <div className="flex">
          <div className="topCountriesWrapper">
              <div className="rounded-lg bg-card h-80">
                  <TopCountries />
              </div>
          </div>

          <div className="segmentationWrapper">
              <div className="rounded-lg bg-card h-80">
                  <Segmentation />
              </div>
          </div>
          <div className="satisfactionWrapper">
              <div className="rounded-lg bg-card h-80">
                  <Satisfication />
              </div>
          </div>
      </div>
  </div>
   );
}

export default App;
