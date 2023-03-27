import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Pool, QueryResult } from 'pg';


const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3001;
/*
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({result: 'success'});
});
*/

app.listen(port)


//not sure if this can be wrtten here  (part2 6/8)

app.get('/', (req: Request, res: Response) => {
    const pool = openDb()

    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            res.status(500).json({error: error.message})
        }
        res.status(200).json(result.rows)
    })
})

const openDb = (): Pool => {
    const pool: Pool = new Pool({
        /*
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'Toomoo',
        port: 5432 */
        user: 'root',
        host: 'dpg-cggm5qm4daddcg4n4blg-a.oregon-postgres.render.com',
        database: 'todo_g23o',
        password: '4zyKTy7SGsapotnLOss76G0tKaTzDQrg',
        port: 5432,
        ssl: true

    })
    return pool
}

app.post('/new', (req: Request, res: Response) => {
    const pool = openDb()

    pool.query('insert into task (description) values ($1) returning *',	
    [req.body.description],
    (error: Error, result: QueryResult) => {
        if (error) {
            res.status(500).json({error: error.message})
        }
        res.status(200).json({id: result.rows[0].id})
    })
})

app.delete('/delete/:id', async(req: Request, res: Response) => {
    const pool = openDb()

    const id = parseInt(req.params.id)

    pool.query('delete from task where id = $1', 
    [id],
     (error: Error, result: QueryResult) => {
        if (error) {
            res.status(500).json({error: error.message})
        }
        res.status(200).json({id: id})
     })
})