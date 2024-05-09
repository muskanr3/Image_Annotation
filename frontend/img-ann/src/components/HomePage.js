import React from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Import custom CSS for styling

class HomePage extends React.Component {
    state = {
        details: [],
        user: "",
        image: null, // State to store uploaded image
        imagePreview: null, // State to store image preview
        annotate: "", // State to store selected annotation
        captions: ["None", "airplanes", "cars", "birds", "cats", "deer", "dogs", "frogs", "horses", "ships", "trucks"], // Dropdown options
        annotations: ["None"],
        width: "", // State to store width input
        height: "", // State to store height input
    };


    componentDidMount() {
        let data;

        axios
            .get("http://localhost:8000/wel/")
            .then((res) => {
                data = res.data;
                this.setState({
                    details: data,
                });
            })
            .catch((err) => { });
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleImageChange = (e) => {
        const file = e.target.files[0];

        // Update image state
        this.setState({
            image: file,
        });

        // Create a FileReader instance
        const reader = new FileReader();

        // Listen for the FileReader load event
        reader.onloadend = () => {
            // Create a new image element
            const image = new Image();
            image.src = reader.result;

            // When the image loads, resize it if width and height are provided
            image.onload = () => {
                if (this.state.width && this.state.height) {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set canvas dimensions to the desired width and height
                    canvas.width = this.state.width;
                    canvas.height = this.state.height;

                    // Draw the image onto the canvas with the specified dimensions
                    ctx.drawImage(image, 0, 0, this.state.width, this.state.height);

                    // Get the data URL of the resized image
                    const resizedImagePreview = canvas.toDataURL('image/jpeg');

                    // Update imagePreview state
                    this.setState({
                        imagePreview: resizedImagePreview,
                    });
                } else {
                    // If no width and height provided, set imagePreview to original image
                    this.setState({
                        imagePreview: reader.result,
                    });
                }
            };
        };

        // Read the image file as a data URL
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", this.state.user);
        formData.append("annotations", JSON.stringify(this.state.annotations));
        formData.append("width", this.state.width);
        formData.append("height", this.state.height);

        // Check if both width and height are provided
        if (this.state.width && this.state.height) {
            // Resize the image before uploading
            this.resizeImage(this.state.image, this.state.width, this.state.height)
                .then(resizedImageBlob => {
                    formData.append("image", resizedImageBlob, this.state.image.name);

                    // Upload the resized image
                    this.uploadFormData(formData);
                })
                .catch(error => {
                    console.error("Error resizing image:", error);
                });
        } else {
            // If width and height are not provided, upload the original image without resizing
            formData.append("image", this.state.image);

            // Upload the original image
            this.uploadFormData(formData);
        }
    };

    uploadFormData = (formData) => {
        // Upload the form data
        axios
            .post("http://localhost:8000/wel/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log("res = ", res);

                // Make a GET request to fetch the updated data after a successful POST
                axios
                    .get("http://localhost:8000/wel/")
                    .then((response) => {
                        this.setState({
                            details: response.data,
                            user: "",
                            image: null,
                            imagePreview: null,
                            annotations: [],
                            width: "",
                            height: "",
                        });
                    })
                    .catch((err) => {
                        console.error("Error fetching data:", err);
                    });
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    };


    resizeImage = (imageFile, width, height) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(blob => {
                        resolve(blob);
                    }, 'image/jpeg', 1);
                };
                img.onerror = error => {
                    reject(error);
                };
            };
            reader.onerror = error => {
                reject(error);
            };
        });
    };



    handleAnnotationChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        this.setState({ annotations: selectedOptions });
    };

    render() {
        const pendingImages = this.state.details.filter(detail => detail.annotations.includes("None"));
        const annotatedImages = this.state.details.filter(detail => !detail.annotations.includes("None"));

        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Image Annotation</h2>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="author" style={{ fontSize: "20px" }}>Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="author"
                                            placeholder="Enter author name"
                                            value={this.state.user}
                                            name="user"
                                            onChange={this.handleInput}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="imageUpload" style={{ fontSize: "20px" }}>Upload Image</label>
                                        <br />

                                        <div className="custom-file">
                                            <input
                                                type="file"
                                                className="custom-file-input"
                                                id="imageUpload"
                                                onChange={this.handleImageChange}
                                            />

                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="width" style={{ fontSize: "20px" }}>Width</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="width"
                                            placeholder="Enter width"
                                            value={this.state.width}
                                            name="width"
                                            onChange={this.handleInput}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="height" style={{ fontSize: "20px" }}>Height</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="height"
                                            placeholder="Enter height"
                                            value={this.state.height}
                                            name="height"
                                            onChange={this.handleInput}
                                        />
                                    </div>

                                    {this.state.imagePreview && (
                                        <div className="text-center mt-3">
                                            <img
                                                src={this.state.imagePreview}
                                                alt="Preview"
                                                className="img-fluid"
                                                style={{ maxWidth: "300px" }}
                                            />
                                        </div>
                                    )}

                                    <div className="form-group">

                                        <label htmlFor="annotations" style={{ fontSize: "20px" }}>Annotations</label>

                                        <br />
                                        Keep CTRL pressed and click on the options to select multiple annotations

                                        <select
                                            className="form-control"
                                            id="annotations"
                                            value={this.state.annotations}
                                            onChange={this.handleAnnotationChange}
                                            name="annotations"
                                            multiple
                                        >
                                            {this.state.captions.map((annotate, index) => (
                                                <option key={index} value={annotate}>
                                                    {annotate}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-block mt-4">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-6">
                        <h3 className="text-center mb-4">Pending Images</h3>
                        <div className="image-grid">
                            {pendingImages.map((detail, id) => (
                                <div key={id} className="image-card">
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
                            ))}
                        </div>
                    </div>
                    {/* <div className="col-md-6 vertical-line"></div>  */}
                    <div className="col-md-6  vertical-line">
                        <h3 className="text-center mb-4">Annotated Images</h3>
                        <div className="image-grid">
                            {annotatedImages.map((detail, id) => (
                                <div key={id} className="image-card">
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;