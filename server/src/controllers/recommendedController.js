const recommendedModel = require('../models/recommendedModel');
const gradesModel = require('../models/gradesModel');
const studentModel = require('../models/studentModel');
const rankingModel = require('../models/rankingModel');
// const recommendedModel = require('../models/recommendedModel');

const getStrandConditions = async (req, res) => {
    try {
        const result = await recommendedModel.getStrandConditionModel();
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const recommendStrand = async (studentId) => {
    try {
        // get the grades by studentId
        const getGradesById = await gradesModel.getGradesById(studentId);
        // get all conditions 
        const getAllRecommendationConditions = await recommendedModel.getStrandConditionModel();

        // check if the average meet the conditions
        const checkAverageConditions = () => {
            const studentStrand = getGradesById[0].strand;
            const meetAverage = getAllRecommendationConditions.find((strand) => {
               return strand.name === studentStrand && getGradesById[0].average >= strand.recommendationConditions.average;
            });
            
            if (meetAverage) {
                return true;
            } else {
                return false;
            }
        } 

        // check if the subject meet the conditions
        const checkSubjectConditions = (strandName) => {
            // filter the subject that is not needed
           const studentSubjects = Object.keys(getGradesById[0]).filter(subject => 
            subject !== 'studentId' && subject !== 'average' && subject !== 'course' && subject !== 'strand'
            );

            let allSubjectsMeetConditions = true; // Assumes all subjects meet conditions initially

            studentSubjects.forEach((subject) => {
                const subjectGrade = parseInt(getGradesById[0][subject]);
                const strandConditions = getAllRecommendationConditions.find(strand => strand.name === strandName);

                if (strandConditions && strandConditions.recommendationConditions.hasOwnProperty(subject)) {
                    const condition = parseInt(strandConditions.recommendationConditions[subject]);

                    if (subjectGrade < condition) {
                        // if any subjects doesnt meet the condition, update the variable
                        allSubjectsMeetConditions = false;
                    } 
                } 
            });
            
            return allSubjectsMeetConditions;
        };

                 // get the recommended strand
            let recommendedStrandData = ''

            const getRecommendedStrand = async () => {
            const studentStrand = getGradesById[0].strand
            if (checkAverageConditions() || checkSubjectConditions(studentStrand)) {
                recommendedStrandData = studentStrand;
            } else {
                recommendedStrandData = getFirstStrand;
            }
        
                // update the recommended strand in student data 
                const updateRecommended = await studentModel.updateRecommended(studentId, recommendedStrandData);
                console.log(recommendedStrandData)
                return updateRecommended;
            }

            // check if the average meet the conditions
        const checkAllAverageConditions = (strandName) => {
            const meetAllAverage = getAllRecommendationConditions.find((strand) => {
                return strand.name === strandName && getGradesById[0].average >= strand.recommendationConditions.average;
            });

            if (meetAllAverage) {
                return true;
            } else {
                return false;
            }
        };

        // get the ranking of the strand
        const getStrandRanking = () => {
            const studentStrand = getGradesById[0].strand;
        
            const strandRanking = [];

            getAllRecommendationConditions.forEach((strand) => {
                const meetAverage = checkAllAverageConditions(strand.name);  // pass the strand to checkAverageConditions function
                const meetGrades = checkSubjectConditions(strand.name);  // pass the strand to checkSubjectConditions function
                const meetStrandGradeCourse = meetAverage && meetGrades && studentStrand === strand.name;

                 // ranking reasons
            const strandRankingReasons = {
                meetAllConditions: `Your grades qualify you for this strand , and it matches perfectly to course you’ve selected`,
                meetAverageAndGrades: `Your grades qualify you for this strand , but your desired course is not related to ${strand.name}`,
                meetAverageAndCourse: `Your grades are just a step away from qualifying for this strand , but the course you’ve selected is related to ${strand.name}`,
                meetGradesAndCourse: `Your grades are just a step away from qualifying for this strand , but the course you’ve selected is related to ${strand.name}.`,
                meetAverage: `Your grades are just a step away from qualifying for this strand , and the course you’ve selected is not related to ${strand.name}.`,
                meetGrades: "Your grades are just a step away from qualifying for this strand , but it doesn’t match your desired course.",
                meetCourse: `Your grades did not reach the set conditions for this strand, but your desired course is related to ${strand.name}.`,
                notMeetConditions: `Your grades did not reach the set conditions for this strand, and the course you’ve selected is not related to ${strand.name}.`
            };

                let condition = '';
                let reasons = '';
            
                if (meetStrandGradeCourse) {
                    condition = 'meet average, grades and course';
                    reasons = strandRankingReasons.meetAllConditions;
                } else if (meetAverage && meetGrades) {
                    condition = 'meet average and grades';
                    reasons = strandRankingReasons.meetAverageAndGrades;
                } else if (meetAverage && studentStrand === strand.name) {
                    condition = 'meet average and course';
                    reasons = strandRankingReasons.meetAverageAndCourse;
                }  else if (meetGrades && studentStrand === strand.name) {
                    condition = 'meet grades and course';
                    reasons = strandRankingReasons.meetGradesAndCourse;
                }  else if (meetAverage) {
                    condition = 'meet average';
                    reasons = strandRankingReasons.meetAverage;
                } else if (meetGrades) {
                    condition = 'meet grades';
                    reasons = strandRankingReasons.meetGrades;
                } else if (studentStrand === strand.name) {
                    condition = 'meet course';
                    reasons = strandRankingReasons.meetCourse;
                } else {
                    condition = 'not meet conditions';
                    reasons = strandRankingReasons.notMeetConditions;
                }

                strandRanking.push({ name: strand.name, condition, reasons})
            });
            
            const conditionsOrder = {
                'meet average, grades and course': 1, 
                'meet average and grades': 2,
                'meet average and course': 3,
                'meet grades and course': 4,
                'meet average': 5,
                'meet grades': 6,
                'meet course': 7,
                'not meet conditions': 8,
            };

            strandRanking.sort((strandA, strandB) => {
                return conditionsOrder[strandA.condition] - conditionsOrder[strandB.condition];
            });

            console.log(strandRanking) 
            return strandRanking;
        }

        // run the function to get the strand ranking
        const strandRankingArray = getStrandRanking();
        // console.log(strandRankingArray)

        // add the ranking to the database
        const addRanking = await rankingModel.addRanking(studentId, JSON.stringify(strandRankingArray));
        console.log(addRanking)

        // get the first strand in the ranking
        const getFirstStrand = strandRankingArray[0].name;

        // run the function to get the recommended strand
        getRecommendedStrand(getFirstStrand);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    getStrandConditions,
    recommendStrand,
    // updateRecommended
    // getStrandRanking
}