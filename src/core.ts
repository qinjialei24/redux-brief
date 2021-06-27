type Options<
  Namespace,
  State,
  Reducer,
  > = {
  readonly namespace:Namespace
  readonly state:State
  readonly reducer:Reducer
};

export function createModule<
  Namespace extends string,
  State extends Record<string, unknown>,
  Reducer extends Record<string, (payload:never,state:State)=>void>
  >(options:Options<Namespace,State,Reducer>){
  return options as unknown as  Reducer
}

// const xxx = createModule({
//   namespace:'1',
//   state:{
//     count:1
//   },
//   reducer:{
//     add(payload:number,state){
//       state.count+=1
//     },
//     add2(payload:number,state){
//       state.count+=2
//     },
//   }
// })
//
// const xxx2 = createModule({
//   namespace:'1',
//   state:{
//     count:1
//   },
//   reducer:{
//     add(payload:number,state){
//       state.count+=1
//     },
//     add2(payload:string,state){
//       state.count+=2
//     },
//   }
// })
//
// type MyModules= {
//   readonly module1:typeof xxx
//   readonly module2:typeof xxx2
// };
//
// // type xxx2 = typeof xxx & typeof xxx2
//
// const q = {} as MyModules
// //
// // q.module1.add(1)
// // q.module2.add2('')
//




