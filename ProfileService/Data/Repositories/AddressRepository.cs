using Data.Context;
using Data.Entities;
using Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories;

public class AddressRepository(DataContext dataContext) : BaseRepository<AddressEntity>(dataContext), IAddressRepository
{
    public override async Task<AddressEntity> AddAsync(AddressEntity entity)
    {
        // Check if an address already exists in the database
        var existingAddress = await _dataContext.Addresses.FirstOrDefaultAsync(x =>
            x.ZipCode == entity.ZipCode &&
            x.City == entity.City &&
            x.Country == entity.Country &&
            x.State == entity.State &&
            x.Street == entity.Street
            );
        if (existingAddress != null)
        {
            // If an address exists, return the existing address instead of adding a new one
            return existingAddress;
        }

        // If no existing address is found, proceed to add the new address
        entity.Id = 0;
        var result = await _dataContext.Addresses.AddAsync(entity);
        _dataContext.SaveChanges();

        return result.Entity;
    }
}