const strandModel = require('../models/strandModel');
const date = require('date-and-time');
const fs = require('fs');

const getAllStrands = async (req, res) => {
    try {
        const strands = await strandModel.getAllStrand();
        return res.json(strands);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getStrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const strand = await strandModel.getStrandById(id);
        return res.json(strand);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const addStrand = async (req, res) => {
    const { name, description, recommendationConditions } = req.body;
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');

    try {
      const strandNameExists = await strandModel.strandNameExists(name);
  
      if (strandNameExists) {
        return res.status(400).json({ status: 'error', message: 'Strand name already exists' });
      } else {
         // Asynchronously rename and upload files
         const imageFileNames = [];

         await Promise.all(
            req.files.map(async (file) => {
              const fileType = file.mimetype.split('/')[1];
              const newFileName = `${file.filename}.${fileType}`;
      
              try {
                await fs.promises.rename(`./uploads/${file.filename}`, `./uploads/${newFileName}`);
                console.log('Uploaded Success');
                imageFileNames.push(newFileName);
              } catch (err) {
                console.error('Error renaming/uploading file:', err);
                throw new Error('File upload error');
              }
            })
          );

      const result = await strandModel.addStrand(
        imageFileNames.join(','),
        name,
        description,
        recommendationConditions,
        formattedDate
      );
  
    return res.status(201).json({ success: true, message: 'Strand added successfully', result })
    }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };

const updateStrand = async (req, res) => {
    const { id } = req.params;
    const { name, description, recommendationConditions } = req.body;
    const updatedAt = new Date();

    let imageFilenames = [];
    if (req.body.image) {
      try {
        imageFilenames = JSON.parse(req.body.image);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }

    await Promise.all(
        req.files.map(async (file) => {
          const fileType = file.mimetype.split('/')[1];
          const newFileName = `${file.filename}.${fileType}`;
  
          try {
            await fs.promises.rename(`./uploads/${file.filename}`, `./uploads/${newFileName}`);
            console.log('Uploaded Success');
            imageFilenames.push(newFileName);
          } catch (err) {
            console.error('Error renaming/uploading file:', err);
            throw new Error('File upload error');
          }
        })
      );

    try {
        for (const imageName of imageFilenames) {
            const file = req.files.find((f) => f.originalname === imageName);
      
            if (file) {
              const newFileName = await renameFile(file);
              imageFilenames.push(newFileName);
            }
          }

        const result = await strandModel.updateStrand(
          id,
          imageFilenames.join(','),
          name,
          description,
          recommendationConditions,
          updatedAt
        );

        return res.status(200).json({ success: true, message: 'Strand updated successfully', result })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteStrand = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await strandModel.deleteStrand(id);
        return res.json({ success: true, message: 'Strand deleted successfully', result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getAllStrands,
    getStrandById,
    addStrand,
    updateStrand,
    deleteStrand
}