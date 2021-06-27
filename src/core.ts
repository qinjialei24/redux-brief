type Options<
  Namespace,
  State,
  > = {
  readonly namespace:Namespace
  readonly state:State
  //todo 类型优化， 这里 payload 由用户传入，未避免使用 any，所以使用 never，本来想使用 unknown,但是类型报错？
  readonly reducer:Record<string, (payload:never,state:State)=>void>
};



export function createModule<
  Namespace extends string,
  State extends Record<string, unknown>,
  >(options:Options<Namespace,State>){
  return options
}

// createModule({
//   namespace:'1',
//   state:{
//     count:1
//   },
//   reducer:{
//     add(payload:number,state){
//       state.count+=1
//     }
//   }
// })
