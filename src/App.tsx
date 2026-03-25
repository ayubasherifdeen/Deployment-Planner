import './App.css'
import PersonnelDeploymentPlanner from './components/page'
import INITIAL_PERSONNEL from './data/PersonnelData'
import INITIAL_MISSIONS from './data/MissionData'



export default function App() {
  return(
     <PersonnelDeploymentPlanner persons={INITIAL_PERSONNEL} missions={INITIAL_MISSIONS} />
  )
 }

