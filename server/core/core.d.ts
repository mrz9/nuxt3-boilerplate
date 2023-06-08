declare namespace Express {
    type MessageOrOptions =
        | string
        | {
              code?: number
              msg: string
          }
    interface Application {
        root: string
        __dirname: string
        __filename: string
        isProd: boolean
        logger: any
    }
    interface Response {
        error: (messageOrOptions: MessageOrOptions) => void
        success: (data: any, code?: number) => void
    }

    interface Request {
        session: any
    }
}
