import {extend} from "../shared";
//当前的effect
let activeEffect
let shouldTrack = false

export class ReactiveEffect {
  private _fn: any;
  public scheduler: Function | undefined;
  deps = []
  //一旦stop active为false
  active = true
  onStop?: () => void

  constructor(fn, scheduler?: Function | undefined) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    if (!this.active) {
      return this._fn()
    }
    shouldTrack = true
    activeEffect = this
    const res = this._fn()
    shouldTrack = false
    return res
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

//依赖容器
const targetMap = new Map();

export function track(target, key) {
  //if (!shouldTrack) return
  //if (!activeEffect) return
  if (!isTracking()) return
  //target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackEffects(dep)
}

export function trackEffects(dep) {
  // 已经在dep中
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if(!depsMap) return
  let dep = depsMap.get(key)
  for (let effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function refTrigger(dep) {
  for (let effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}


export function effect(fn, options: any = {}) {
  //fn
  const {scheduler, onStop} = options
  const _effect = new ReactiveEffect(fn, scheduler)
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect
  return runner
}


export function stop(runner) {
  runner.effect.stop()
}
