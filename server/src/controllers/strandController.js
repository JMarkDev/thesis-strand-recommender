const strandModel = require('../models/strandModel');
const date = require('date-and-time');
const fs = require('fs');

const getAllStrands = async (req, res) => {
    try {
        const strands = await strandModel.getAllStrand();

        strands.forEach((strand) => {
            const parsedConditions = JSON.parse(strand.recommendationConditions);
            strand.recommendationConditions = parsedConditions;

            const strandImages = strand.image.split(',');
            strand.image = strandImages;
        })

        return res.status(200).json(strands);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getStrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const strand = await strandModel.getStrandById(id);

        const strandData = strand.map((strand) => {
            return {
                id: strand.id,
                image: strand.image,
                name: strand.name,
                description: strand.description,
                recommendationConditions: JSON.parse(strand.recommendationConditions),
                createdAt: strand.createdAt
            }
        })

        // const parsedConditions = JSON.parse(strand[0].recommendationConditions);
        // strand[0].recommendationConditions = parsedConditions;

        // const arrayImages = strand[0].image.split(',');
        // strand[0].image = arrayImages;
        
        return res.status(200).json(strandData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getStrandByName = async (req, res) => {
  try {
    const { name } = req.params;
    const strand = await strandModel.getStrandByName(name);
    const parsedConditions = JSON.parse(strand[0].recommendationConditions);
    strand[0].recommendationConditions = parsedConditions;
    return res.json(strand);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error"});
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

const strandRecommendedTotal = async (req, res) => {
  try {
    const result = await strandModel.getTotalStrandRecommended()

    const strandCount = {};
    let totalRecommended = 0; 
    
    result.forEach((row) => {
      const strand = row.strand;
      const recommendedCount = row.recommendedCount; // Use the correct name here
      strandCount[strand] = recommendedCount;
      totalRecommended += recommendedCount;
    });
    

    // add total count for all strand columns
    strandCount['TOTAL'] = totalRecommended
    
    // Convert the object into an array of objects with the "TOTAL" count first
    const strandCountArray = Object.entries(strandCount).map(([strand , recommendedCount]) => ({ strand, recommendedCount }));
    // put the total in first index
    strandCountArray.sort((a, b) => (a.strand === 'TOTAL' ? - 1 : b.strand === 'TOTAL' ? 1 : 0));

    return res.status(200).json(strandCountArray)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const getStrandMonthlyData = async (req, res) => {
  const selectedYear = req.params.year;
  
  try {
    const result = await strandModel.getMonthlyData(selectedYear);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error'})
  }
}

module.exports = {
    getAllStrands,
    getStrandById,
    getStrandByName,
    addStrand,
    updateStrand,
    deleteStrand,
    strandRecommendedTotal,
    getStrandMonthlyData
}