import React, { useEffect, useState } from 'react';
//import {LineChart, XAxis, Tooltip, CartesianGrid, Line} from 'recharts';
//import { isTemplateExpression } from 'typescript';
import api from './services/api';


interface ICustomFields {
    id: number;
    name: string;
    value: string;    
}

interface ItemGroup<T> {
  [key: string]: T[];
}
interface Item<T = any> {
  [key: string]: T
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

  tracker_name : string;
  month: number;
  year: number;
}

interface ITotals {
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
  } 

  async function loadData (skip : number, itens : Iissues[] ): Promise<void> {
    const response = await api.get(`issues.json?status_id=*&limit=100&offset=${skip}&created_on=%3E%3C2020-01-01|2020-12-30&key=1927788238b0418601fd837aeabcdd9437042b4c`);        
    const newArray : Iissues[] = response.data.issues;

     setIssues([...itens, ...newArray]);
     
    // if (newArray.length === 100){
    //   loadData(skip+100,newArray) ;
    // }

  }

   useEffect (  () => {

    const newArray : Iissues[] = [];

    issues.map(item => { 
      
      const newItem : Iissues = { ...item, 
        tracker_name : item.tracker.name,
        month: new Date(item.created_on).getMonth()+1 ,
        year: new Date(item.created_on).getFullYear() };
        newArray.push(newItem);
    });

     const imp = 'Implementação';

     function groupBy<T extends Item>(array: T[], key: keyof T): ItemGroup<T> {
      return array.reduce<ItemGroup<T>>((map, item) => {
        const itemKey = item[key]
        if(map[itemKey]) {
          map[itemKey].push(item);
        } else {
          map[itemKey] = [item]
        }
    
        return map
      }, {})
    }
    const groupTracker = groupBy(newArray, "tracker_name" );
    groupTracker.map(item=> (console.log(item)));


    // const implementationQuantity = issues.reduce(function (total, item) {
    //   if (item.tracker.name === imp) {
    //     total++;
    //   }
    //   else {
    //     total;
    //   }
    //   return total;
    // }, {});
    
//    console.log(implementationQuantity);

//     issues.map( item => {

// //      const day = new Date(item.created_on).getDay();
//       const month = new Date(item.created_on).getMonth()+1;
//       const year = new Date(item.created_on).getFullYear();


//       const implementationQuantity = issues.reduce(
//         (acumulador , valorAtual) =>  valorAtual.tracker.name === 'Implementação' ? acumulador++ : acumulador
//         , 0
//       );
//       console.log(implementationQuantity);

//       const bugQuantity = issues.reduce(
//         (acumulador , valorAtual) =>  valorAtual.tracker.name === 'Correção de Bug' ? acumulador++ : acumulador
//         , 0
//       );
//       console.log(bugQuantity);

//      if (item.tracker.name === 'Implementação') {
//       setImplementationIssues([ ...[{month, year, quantity: implementationQuantity , tracker: item.tracker.name}]]);

//       } else if (item.tracker.name === 'Correção de Bug') {
//         setBugIssues([ ...[{ month, year, quantity: bugQuantity, tracker: item.tracker.name}]]);
//       }
//     })


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