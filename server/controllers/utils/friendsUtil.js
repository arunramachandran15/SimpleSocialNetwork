const promise = require('promise');
const User = require('../../models/user');
const _=require('underscore');
const Queue = require('queue-fifo');
const nextLevel = 'end';


const self = module.exports = {

    // Description : recursive breadth first service function to trace connections for a user
    // params //
    // target : user to be found in connection
    // queue : fifo datastructure for holding user_ids for traversal
    // discovered : Array to maintain visited nodes
    // parent_resolve : promise resolve from main call
    // parent_reject : promise reject from main call
    // Return : promise to controller 
    recursiveGetFriends : (target,queue,discovered,count,parent_resolve,parent_reject) => {
           if(queue.isEmpty()){  // if queue is empty then no connections available return -999
              parent_resolve(-999);
              return;
           }
           source = queue.peek();  //Fetch first element in queue and find all its friends from DB
           queue.dequeue();
           User.getFriends(source).then((friends)=>{
              _.each(friends,(friend)=>{  //For each user check if its already traversed using discovered array
                  if(!discovered[friend.user_id]){
                      discovered[friend.user_id] = true;
                      if(friend.user_id == target){  //if target user_id found in return the distance from source : count
                          parent_resolve(count+1);
                          return;
                      }else{
                          queue.enqueue(friend.user_id);  //else add the user to queue
                      }
                  }
              })
              if(queue.peek() == nextLevel ){ // if next level flag, increment the distance count
                  queue.dequeue();
                  if(queue.isEmpty()){
                      parent_resolve(-999);
                      return;
                  }
                  queue.enqueue(nextLevel);  //Add next level flag to queue
                  count++;
              }
              //recursive call to find connections for users in queue
              self.recursiveGetFriends(target,queue,discovered,count,parent_resolve,parent_reject);
          }).catch((err)=>{
                parent_reject(err)
          }); 
      }

}


