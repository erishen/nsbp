interface ServerState {
  photo?: {
    data?: [number, number, string][]
    menu?: Record<string, any> | Array<{ name: string; cover?: string; count?: number }>
  }
  query?: Record<string, any>
}

declare interface Window {
  context: {
    state: ServerState
  }
}
