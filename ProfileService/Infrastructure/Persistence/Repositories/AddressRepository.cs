using Infrastructure.Persistence.Context;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;

namespace Infrastructure.Persistence.Repositories;

public class AddressRepository(DataContext dataContext) : BaseRepository<AddressEntity>(dataContext), IAddressRepository
{
    public override async Task<AddressEntity> AddAsync(AddressEntity entity)
    {
        var existingAddress = await _context.Addresses.FirstOrDefaultAsync(x =>
            x.ZipCode == entity.ZipCode &&
            x.City == entity.City &&
            x.Country == entity.Country &&
            x.State == entity.State &&
            x.Street == entity.Street
            );
        if (existingAddress != null)
            return existingAddress;

        entity.Id = 0;
        var result = await _context.Addresses.AddAsync(entity);
        _context.SaveChanges();

        return result.Entity;
    }
}