import Post from '../post'
import request from 'supertest'
import app from '../../app'

it('implements optimistic concurrency control', async ()=> {
    
    const cookie = global.getCookie("lkjgt", "test@test.com")
    
    const res = await request(app)
                .post('/api/posts')
                .set('Cookie',cookie)
                .send({
                       topic: "Technical Writting",
                        body: "Its a lucrative field"
                      })
                .expect(201)
    const firstInstance = await Post.findById({_id: res.body.id})
    const secondInstance = await Post.findById({_id: res.body.id})

    firstInstance!.set('topic', 'web3')
    secondInstance!.set('topic','devops')
    await firstInstance!.save()
    
    try{
        await secondInstance!.save()
    }catch(err){
        return
    }

    throw new Error('should not get to this point') 
        
}); 


it('increments version number on multiple saves', async () => {
    const cookie = global.getCookie("lkjgt", "test@test.com")
    
    const res = await request(app)
                .post('/api/posts')
                .set('Cookie',cookie)
                .send({
                       topic: "Technical Writting",
                        body: "Its a lucrative field"
                      })
                .expect(201)
    const firstInstance = await Post.findById({_id: res.body.id})
    await firstInstance!.save()
    expect(firstInstance!.version).toEqual(1)
    await firstInstance!.save()
    expect(firstInstance!.version).toEqual(2)
});