# DocBook  

DocBook is a CLI app meant to provide developers with an easy way to write documentation locally. Users can create in-depth documentation using rich text and markdown as well as writing JavaScript code capable of bundling and executing in the browser! Under the hood, DocBook utilizes esbuild to execute the provided code. DocBook also supports imports via a custom esbuild plugin and unpkg.com.  

## Installation  

- Fork and clone this repository
- Install project dependencies    
    ```bash    
    npm install   
    ```  
    or  
    ```bash  
    yarn install  
    ```  
- Run DocBook locally
    ```bash  
    npm run dev  
    ```  
    or  
    ```bash  
    yarn dev  
    ```  

## 🚧 Upcoming Features  

- [ ] Implement zustand for state management across various text and code blocks
- [ ] Allow for creation of multiple pages
 
