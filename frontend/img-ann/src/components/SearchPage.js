import React from "react";
import axios from "axios";

class SearchPage extends React.Component {
    state = {
        details: [],
        searchQuery: "",
    };

    componentDidMount() {
        // Fetch data from API and update state
        axios.get("http://localhost:8000/wel/")
            .then((res) => {
                this.setState({
                    details: res.data,
                });
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    }
    handleSearch = () => {
        const { searchQuery, details } = this.state;
        const filteredDetails = details.filter(detail =>
            detail.annotations.some(annotation => annotation.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        return filteredDetails;
    };

    render() {
        const { searchQuery } = this.state;
        const filteredDetails = this.handleSearch();

        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Image Annotation</h2>
                                <form onSubmit={this.handleSubmit}>
                                    {/* Form Inputs */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Input */}
                <div className="row justify-content-center my-4">
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by annotation..."
                            value={searchQuery}
                            onChange={(e) => this.setState({ searchQuery: e.target.value })}
                        />
                    </div>
                </div>

                <div className="row mt-5">
                    {/* Display Filtered Images */}
                    {filteredDetails.map((detail, id) => (
                        <div key={id} className="col-md-6">
                            <div className="image-card">
                                <div className="card-body">
                                    <h5 className="card-title">User: {detail.name}</h5>
                                    <img
                                        src={detail.image_url}
                                        alt="Image"
                                        className="img-fluid"
                                    />
                                    <div className="mt-3">
                                        <h6>Annotations:</h6>
                                        <ul className="list-unstyled">
                                            {detail.annotations.map((annotation, index) => (
                                                <li key={index}>{annotation}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default SearchPage;
