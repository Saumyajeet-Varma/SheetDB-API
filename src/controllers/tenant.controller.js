import { registerTenantService } from "../services/tenant.service.js";

export const registerTenant = async (req, res) => {

    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Tenant name required"
            })
        }

        const result = await registerTenantService(name)

        res.status(201).json({
            success: true,
            message: "Tenant created",
            data: {
                tenantId: result.tenantId,
                database: result.database
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "tenant registration failed"
        })
    }
}