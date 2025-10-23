import { PrismaClient, Device, Status, DeviceStatus } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();

export interface RawMapping {
    nodeId: string,
    machine: {
        id: number
    }
}
export interface CreateDeviceData {
    nodeId: string,
    description: string,
    status: DeviceStatus,
    clientId: number
}
export interface UpdateDeviceData {
    description?: string,
    status?: DeviceStatus,
}
export const deviceRepository = {

        findActiveMappings: async(): Promise<RawMapping[]> =>{
        try {
            const result = await prisma.device.findMany({
                where:{
                    machine: {
                        isNot: null
                    }
                },
                select: {
                    nodeId: true,
                    machine:{
                        select:{
                            id:true
                        }
                    }
                }
            });
            return result as RawMapping[] 
        } catch (err) {
            console.error("Erro ao buscar máquinas ativas:", err);
            throw new Error("Falha ao acessar o banco de dados para buscar mapeamentos.");
        }
    },
    assignGatewayToDevice: async(gatewayId: number, deviceId: number): Promise<Device> =>{
        try {
            const result = await prisma.$transaction([
                prisma.device.update({
                    where: {
                        id: deviceId
                    },
                    data: {
                        status: 'ONLINE',
                        gateway:{
                            connect: {
                                id: gatewayId
                            },
                        },
                    },
                    include: {
                        gateway: true
                    }
                }),
                prisma.gateway.update({
                    where: {
                        id: gatewayId
                    },
                    data: {
                        status:'ONLINE'
                    }
                })
            ]);
            const updateDevice = result[0];

            return updateDevice;
        } catch (error) {
            console.error("Erro ao atribuir gateway ao dispositivo:", error);
            throw new Error("Falha ao acessar o banco de dados para atribuir gateway ao dispositivo.");
        }
    },
    findDeviceById: async(deviceId: number): Promise<Device | null> =>{
        try {
            const result = await prisma.device.findUnique({
                where: {
                    id: deviceId
                }
            });
            return result;
        } catch (error) {
            console.error("Erro ao buscar dispositivo por ID:", error);
            throw new Error("Falha ao acessar o banco de dados para buscar dispositivo por ID.");
        }
    },
    createDevice: async(data: CreateDeviceData): Promise<Device> =>{
        try{
            const result = await prisma.device.create({
                data: data
            })

            return data as Device;
        } catch(error) {
            console.error("Erro ao criar dispositivo:", error);
            throw new Error("Falha ao acessar o banco de dados para criar dispositivo.");
        }
    },
    updateDevice: async (deviceId: number, data: UpdateDeviceData): Promise<Device> => {
        try {
            const updatedDevice = await prisma.device.update({
                where: {
                    id: deviceId
                },
                data: data 
            });
            return updatedDevice;
        } catch (error) {
            
            console.error(`Erro ao atualizar dispositivo ${deviceId}:`, error);
            throw new Error("Falha ao acessar o banco de dados para atualizar dispositivo.");
        }
    },
    deleteDevice: async (deviceId: number): Promise<Device> => {
        try {
            const deletedDevice = await prisma.device.update({
                where: {
                    id: deviceId
                },
                data: {
                    status: 'CANCELED'
                }
            });
            return deletedDevice;
        } catch (error) {
            console.error(`Erro ao (soft) deletar dispositivo ${deviceId}:`, error);
            throw new Error("Falha ao acessar o banco de dados para deletar dispositivo.");
        }
    },
    findAllDevices: async (userId: number): Promise<Device[]> => {
        try {
            const user = await prisma.client.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true 
                }
            });

            if (!user) {
                console.warn(`Usuário ${userId} não encontrado para buscar dispositivos.`);
                return []; 
            }

            const devices = await prisma.device.findMany({
                where: {
                    clientId: user.id
                },
                include: {
                    machine:{
                        select: {
                            name: true
                        }
                    },
                },
            });
            
            return devices;

        } catch (error) {
            console.error("Erro ao buscar todos os dispositivos por usuário:", error);
            throw new Error("Falha ao acessar o banco de dados para buscar dispositivos.");
        }
    },
}