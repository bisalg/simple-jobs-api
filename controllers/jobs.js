const Jobs_Model = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


const getAllJobs = async (req, res) => {
    const alljobs = await Jobs_Model.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs: alljobs, count: alljobs.length })
}

const getJob = async (req, res) => {
    const { userId } = req.user
    const { id: jobId } = req.params
    const singlejob = await Jobs_Model.findOne({ createdBy: userId, _id: jobId })
    if (!singlejob) throw new NotFoundError('no job found')
    res.status(StatusCodes.OK).json({ job: singlejob })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Jobs_Model.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const patchJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId }
    } = req

    if (!company || !position) throw new BadRequestError('provide company and position')

    const patched = await Jobs_Model.findByIdAndUpdate({ createdBy: userId, _id: jobId }, req.body, { new: true, runValidators: true })

    if (!patched) throw new NotFoundError(`no job found`)

    res.status(StatusCodes.OK).json({ job: patched })
}

const deleteJob = async (req, res) => {
    const {
        params: { id: jobId },
        user: { userId }
    } = req
    const deleted = await Jobs_Model.findByIdAndDelete({ _id: jobId, createdBy: userId })
    res.status(StatusCodes.OK).json({ job: deleted })
}

module.exports = { getAllJobs, getJob, createJob, patchJob, deleteJob }