import nats, {Stan} from 'node-nats-streaming';

 class NatsWrapper {
    private _client?:Stan;

    get client():Stan{
        if(!this._client){
            throw new Error(`can not access client before
             connecting to the nats streaming server`);
        }
        return this._client;
    }

    connect(clusterId:string, clientId:string,url:string):Promise<void>{

        this._client = nats.connect(clusterId, clientId,{url});

        return new Promise((resolve,reject)=>{
            this.client.on('error', (err)=>{
                return reject(err)
            })

            this.client.on('connect', ()=>{
                console.log('successfully connected to nats server');
                resolve()
            })
        })
    }
};

export const natsWrapper = new NatsWrapper();