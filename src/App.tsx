import React, { useEffect, useState } from 'react';
import {LineChart, XAxis, Tooltip, CartesianGrid, Line} from 'recharts';
import { isTemplateExpression } from 'typescript';
import api from './services/api';


interface ICustomFields {
    id: number;
    name: string;
    value: string;    
}

interface Iissues {
  
  id : number;
  created_on: string;
  
  author : {
    name: string;
  }

  tracker: {
    id: number;
    name: string;
  }

  project: {
    id: number;
    name: string;
  }
  subject: {
    id: number;
    name: string;
  }
  custom_fields: ICustomFields[];
}

interface ITotals {
  day : number;
  month : number;
  year: number;
  quantity: number;
  tracker: string;
}

function App() {

   const [issues, setIssues] = useState<Iissues[]>([]);
   const [bugIssues, setBugIssues] = useState<ITotals[]>([]);
   const [implementationIssues, setImplementationIssues] = useState<ITotals[]>([]);
  
   async function handleDefineIssues () {
    await issues.map( item => {

          const day = new Date(item.created_on).getDay();
          const month = new Date(item.created_on).getMonth()+1;
          const year = new Date(item.created_on).getFullYear();
         
          setBugIssues([...bugIssues, ...[{day , month, year, quantity: 2, tracker: item.tracker.name}]]);
      
    });
    console.log(bugIssues);
   } 

  // function handleGetAllIssues (skip: number): Array<Iissues> [] {

  //   api.get(`issues.json?status_id=*&limit=100&offset=${skip}&created_on=%3E%3C2020-04-01|2020-04-30&key=1927788238b0418601fd837aeabcdd9437042b4c`)
  //       .then( response => {
  
  //         if (response.data.issues.length === 100){
  //              return  handleGetAllIssues(100);              
  //         }
  //         else {
  //           return response.data.issues;
  //         }


//          console.log(`issues.json?status_id=*&limit=100&offset=${skip}&created_on=%3E%3C2020-04-01|2020-04-30&key=1927788238b0418601fd837aeabcdd9437042b4c`) ;

        //   if (issues.length > 0 ){
        //   setIssues([...issues, response.data.issues ]);
        //     console.log('>0')    
        //     console.log(issues.length);    
        //   console.log(issues);
        // } else {
        //   setIssues(response.data.issues);
        //   console.log('0')    
        //   console.log(issues);
        // }

//        console.log(response.data.issues.length);

  
  //   });
  // } 
  
 
  async function loadData (skip : number, itens : Iissues[] ): Promise<void> {
    const response = await api.get(`issues.json?status_id=*&limit=20000&offset=${skip}&created_on=%3E%3C2020-01-01|2020-12-30&key=1927788238b0418601fd837aeabcdd9437042b4c`);        
    const newArray : Iissues[] = response.data.issues;

     setIssues([...itens, ...newArray]);
     
    if (newArray.length === 5000){
      loadData(skip+5000,newArray) ;
    }

  }

  useEffect (  () => {

//          console.log(issues);


},[issues]); 

  return (
    <div>
{/* <LineChart
  width={400}
  height={400}
  data={issues}
  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
> */}

 <h2> <button onClick={() => { handleDefineIssues();  }}>Click me 2</button></h2>

{/* //   <XAxis dataKey="created_on" />
//   <Tooltip />
//   <CartesianGrid stroke="#f5f5f5" />
//   <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
//   <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
// </LineChart>
// }}>Click me</button></h2> */}


        <h1>Teste - Consulta Redmine</h1>
        <h2> <button onClick={() => loadData(0,[])}>Click me</button></h2>
          <div>
            { 
               issues.map( item => (
                  <div key={item.id}>
                    <label>{issues.length}</label>
                    <label>  {item.id} </label>
                    <label>  {item.project.name}'-'{item.created_on}'-'{item.subject} </label>
                     {item.custom_fields.map( custonFieldItem => ( custonFieldItem.name === 'Origem' ? custonFieldItem.value : '' )) }  

                  </div>
                  )
                )
              
            } 
          </div>
        </div>
  );
}

export default App;