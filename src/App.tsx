import React, { useEffect, useState } from 'react';
import { XAxis, Tooltip, CartesianGrid, BarChart, YAxis, Legend, Bar} from 'recharts';
import api from './services/api';


interface IDataChart {
  descricao: string | number;
  quantidade: number;

}
interface IDataChartBugImplementacao {
  mes: string ;
  qtImplementacao?: number;
  qtBug?: number;
}

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
  monthAndYear: string;
}


function App() {

   const [issues, setIssues] = useState<Iissues[]>([]);
   const [dataChart, setDataChart] = useState<IDataChart[]>([]);
   const [dataChartBugImp, setDataChartBugImp] = useState<IDataChartBugImplementacao[]>([]);

  //  const [bugIssues, setBugIssues] = useState<ITotals[]>([]);
  //  const [implementationIssues, setImplementationIssues] = useState<ITotals[]>([]);
  
   async function handleDefineIssues () {
  } 

  async function loadData (skip : number, itens : Iissues[] ): Promise<void> {
    const response = await api.get(`issues.json?status_id=*&limit=600&offset=${skip}&key=1927788238b0418601fd837aeabcdd9437042b4c`);        //&created_on=%3E%3C2020-01-01|2020-12-30
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
        monthAndYear: new Date(item.created_on).getMonth()+1 +'/'+new Date(item.created_on).getFullYear()
       };

        newArray.push(newItem);
         
    });

     const implementacao = 'Implementação';
      const correcaoBug = 'Correção de Bug';
    //  const duvidaUsuario = 'Dúvida de Usuário';

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

     const arrayDataMonth : IDataChart[] = [];
     const arrayDataMonthImpBug : IDataChartBugImplementacao[] = [];

     const groupMonth = groupBy(newArray, "monthAndYear" );

     const keys = Object.keys( groupMonth );

     keys.map(itemKey => {
       arrayDataMonth.push({descricao: itemKey , quantidade: groupMonth[itemKey].length }); 
       const groupTracker = groupBy(groupMonth[itemKey], "tracker_name" );

       const keys2 = Object.keys( groupTracker );
       keys2.map(itemKey2 => { 
         if (itemKey2 === implementacao){
          upsert( arrayDataMonthImpBug, {mes: itemKey+'-'+itemKey2, qtImplementacao: groupTracker[itemKey2].length }); 
        } else if (itemKey2 === correcaoBug){
          upsert( arrayDataMonthImpBug, {mes: itemKey+'-'+itemKey2 , qtBug: groupTracker[itemKey2].length }); 
         } 
       })

  
     })
     setDataChart(arrayDataMonth);
     setDataChartBugImp(arrayDataMonthImpBug);
//     console.log(arrayDataMonth);

     function upsert(array : IDataChartBugImplementacao[] , item : IDataChartBugImplementacao) { // (1)
      const i = array.findIndex(_item => _item.mes === item.mes);
      if (i > -1) {
        if (item.qtBug) {
          array[i] = {mes: item.mes, qtBug: array[i].qtBug, qtImplementacao: item.qtImplementacao};
          console.log(array[i]);
        } else if (item.qtImplementacao){
          array[i] = {mes: item.mes, qtBug: item.qtBug, qtImplementacao: array[i].qtImplementacao};
          console.log(array[i]);
        }
        
      } // (2)
      else { 
        array.push(item);
      }
    }


//     const groupTracker = groupBy(newArray, "tracker_name" );
//     console.log(groupTracker);
  //   if (groupTracker[impplementacao]){
  //     const groupByMonth = groupBy(groupTracker[impplementacao],'month');
  //       console.log(groupByMonth);
  // }


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

        <BarChart width={1024} height={400} data={dataChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="descricao" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantidade" fill="#8884d8" />
        </BarChart>


        <BarChart width={1024} height={400} data={dataChartBugImp}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="qtImplementacao" fill="#0b8d2d " />
          <Bar dataKey="qtBug" fill="#d54f32 " />
        </BarChart>


       <h2> <button onClick={() => { handleDefineIssues();  }}>Click me 2</button></h2>




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