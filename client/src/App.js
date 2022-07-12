import React, { useState } from 'react'
import './App.css';
import { Route, BrowserRouter,Routes } from "react-router-dom";
import ManageRepo from './containers/ManageRepo';
import NavBar from './components/NavBar'
import BranchContainer from './containers/BranchesContainer'
import BranchDetail from './containers/BranchDetail'
import CommitDetail from './containers/CommitDetail';
import CreatePR from './containers/CreatePR'
import PrContainer from './containers/PRContainer';

function App() {
  const [repoLink, setRepoLink] = useState()
  return (
    <div className="w-full flex flex-col items-center justify-center ">
        <BrowserRouter>
          <Routes>
              <Route path="home/:repo_id" element={<NavBar /> } >
                <Route path="branches" element={<BranchContainer repoLink={repoLink}/> } />
                <Route path="branch_detail/:branch_id" element={<BranchDetail />} />
                <Route path="commit_detail/:commit_id" element={<CommitDetail />} />
                <Route path="create_pr" element={<CreatePR />} />
                <Route path="prs" element={<PrContainer />} />
              </Route>
              <Route path='/' element={<ManageRepo setRepoLink={(link)=>setRepoLink(link)}/>}/>
          </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
