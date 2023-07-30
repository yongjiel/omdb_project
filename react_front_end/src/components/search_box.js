import React from "react";

class SearchBox extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = props.handleSearchSubmit;
    }

    render() {
        return (
            <>
            <div key={"search_box"}>
            <form onSubmit={this.handleSubmit}>
            <input  placeholder={"Movie Title"} name="search">
            </input> 
            <button type="submit">Search</button>
            </form>
            </div>
            </>
        );
    }

}


export default SearchBox;
