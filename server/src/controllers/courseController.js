const courseModel = require('../models/courseModel');
const date = require('date-and-time');
const fs = require('fs');

const getAllCourse = async (req, res) => {
    try {
        const courses = await courseModel.getAllCourse();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseModel.getCourseById(id);
        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const addCourse = async (req, res) => {
    const { title, description, image, strand } = req.body;
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');

    try {
        const courseTitleExists = await courseModel.courseTitleExists(title);

        if (courseTitleExists) {
            return res.status(400).json({ status: 'error', message: 'Course title already exists' });
        } else {
            let fileType = req.file.mimetype.split('/')[1];
            let newFileName = req.file.filename + '.' + fileType;
            fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, function (err) {
              if (err) throw err;
              console.log('Uploaded Success');
            });
        
            const result = await courseModel.addCourse(
                title,
                description,
                `uploads/${newFileName}`,
                strand,
                formattedDate
            );
        return res.status(201).json({ status: 'success', message: 'Course added successfully', result });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, image, strand } = req.body;
    const updatedAt = new Date();
    const formattedDate = date.format(updatedAt, 'YY/MM/DD HH:mm:ss');

    try {
        let fileType = req.file.mimetype.split('/')[1];
        let newFileName = req.file.filename + '.' + fileType;
        fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, function (err) {
          if (err) throw err;
          console.log('Uploaded Success');
        });

        const result = await courseModel.updateCourse(
            id,
            title,
            description,
            `uploads/${newFileName}`,
            strand,
            formattedDate
        );
        return res.json({ status:'success', message: 'Course updated successfully', result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });   
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await courseModel.deleteCourse(id);
        return res.json({ status: 'success', message: 'Course deleted successfully', result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getCourseByStrand = async (req, res) => {
    try {
        const { strand } = req.params;
        const course = await courseModel.getCourseByStrand(strand);
        return res.json(course);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getAllCourse,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseByStrand
}