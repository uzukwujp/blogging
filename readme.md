# Description

This is a microservice styled blog application. It consist of 5 services: _**post**, **comment**, **auth**, **moderation** and lastly **query** service_ which puts post and comment documents together. _It has **CICD** pipelines that deploy to a **digitalocean managed kubernetes cluster**_.

## Installation

1. Provision your cluster on digital ocean
1. Name your cluster: _prod_ so that the CICD pipeline can work properly.
1. From didgital ocean install kubernetes Nginx ingress controller
1. Generate a Personal Access token from digital ocean
1. Add the access token as a secret using the name: DIGITALOCEAN_ACCESS_TOKEN

## Endpoints

baseUrl = http://www.blogsapi.xyz for now. You can add your own domain name to your cluster.

1. **Post** <baseUrl>/api/users/signup _payload:_ `json {name: string, email: string, password: string}`
1. **Post** <baseUrl>/api/users/signout
1. **Get** <baseUrl>/api/users/currentuser
1. **Post** <baseUrl>/api/users/sigin _payload:_ `json {email: string, password: string}`
1. **Post** <baseUrl>/api/posts _payload:_ `json {topic: string, body: string}`
1. **Put** <baseUrl>/api/posts/:postId _payload:_ `json {topic: string, body: string}`
1. **Delete** <baseUrl>/api/posts/:postId
1. **Post** <baseUrl>/api/comments/:postId _payload:_ `json {content: string}`
1. **Put** <baseUrl>/api/comments/:commentId _payload:_ `json {content: string}`
1. **Delete** <baseUrl>/api/comments/:commentId
1. **Get** <baseUrl>/api/blogs/postId
1. **Get** <baseUrl>/api/blogs
