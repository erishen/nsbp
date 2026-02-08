interface ServerState {
  photo?: {
    data?: [number, number, string][]
    menu?:
      | Record<string, unknown>
      | Array<{ name: string; cover?: string; count?: number }>
  }
  query?: Record<string, unknown>
}

declare interface Window {
  context: {
    state: ServerState
  }
}
