export function shouldUpdateComponent(n1,n2){
  const {props:p1} = n1
  const {props:p2} = n2
  for (const p2Key in p2) {
    if(p2[p2Key] !== p1[p2Key]) {
      return true
    }
  }
  return false
}