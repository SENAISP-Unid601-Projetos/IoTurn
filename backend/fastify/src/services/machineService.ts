import { Device, Gateway, Machine } from '@prisma/client'
import {
  machineRepository,
  NewMachineData,
  RawMachine,
  UpdateMachineData,
} from '../infrastructure/repository/machineRepository'
import { sensoresReadingRepository } from '../infrastructure/repository/sensoresReadingRepository'
import { deviceRepository } from '../infrastructure/repository/deviceRepository'
import { gatewayRepository } from '../infrastructure/repository/gatewayRepository'

export const machineService = {
  createMachine: async (data: NewMachineData): Promise<Machine> => {
    const isPresentGateway = data.gatewayId
      ? await gatewayRepository.findGatewayById(data.gatewayId)
      : null
    const existingSerialNumberCount = await machineRepository.findBySerialNumber(data.serialNumber)
    if (existingSerialNumberCount) {
      throw new Error('Número de série já existe. Por favor, use um número de série único.')
    }

    const machine = await machineRepository.newMachine(data)

    if (isPresentGateway && machine.deviceId) {
      await deviceRepository.assignGatewayToDevice(isPresentGateway.id, machine.deviceId)
    }

    return machine
  },
  getAllUsersMachine: async (id: number): Promise<RawMachine[] | null> => {
    const packageData = Promise.all([
      machineRepository.findAllUsersMachine(id),
      sensoresReadingRepository.findLastCurrentData(id),
      sensoresReadingRepository.findLastRpmData(id),
      sensoresReadingRepository.findLastOilTemperatureData(id),
      sensoresReadingRepository.findLastOilLevelData(id),
    ])
    const {
      0: machines,
      1: lastCurrent,
      2: lastRpm,
      3: lastOilTemp,
      4: lastOilLevel,
    } = await packageData
    return (
      machines?.map((machine) => ({
        ...machine,
        lastCurrent: lastCurrent || null,
        lastRpm: lastRpm || null,
        lastOilTemperature: lastOilTemp || null,
        lastOilLevel: lastOilLevel || null,
      })) || null
    )
  },
  updateMachine: async (machineId: number, data: UpdateMachineData): Promise<Machine> => {
    const isPresentMachine = await machineRepository.findById(machineId)
    if (!isPresentMachine) {
      throw new Error('Máquina não encontrada')
    }

    const { gatewayId, ...machineData } = data

    if (machineData.deviceId) {
      const isPresentDevice = await deviceRepository.findDeviceById(machineData.deviceId)
      if (!isPresentDevice) {
        throw new Error('O novo dispositivo (deviceId) não foi encontrado.')
      }
    }

    const updatedMachine = await machineRepository.updateMachine(machineId, machineData)

    if (gatewayId && updatedMachine.deviceId) {
      const isPresentGateway = await gatewayRepository.findGatewayById(gatewayId)
      if (!isPresentGateway) {
        throw new Error('O novo gateway (gatewayId) não foi encontrado.')
      }
      await deviceRepository.assignGatewayToDevice(isPresentGateway.id, updatedMachine.deviceId)
    }
    return updatedMachine
  },
  deleteMachine: async (machineId: number): Promise<Machine> => {
    const isExists = await machineRepository.findById(machineId)

    if (!isExists) {
      throw new Error('Máquina não encontrada')
    }

    const result = await machineRepository.deleteMachine(machineId)

    return result
  },
  getMachineByClientAndId: async (clientId: number, machineId: number) => {
    const machine = await machineRepository.findMachineByClientAndId(clientId, machineId)
    return machine
  },
}
